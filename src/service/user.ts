import { SearchUser } from '@/model/user';
import { client } from './sanity';

type OauthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  image?: string | null;
};

export async function addUser({ id, username, email, name, image }: OauthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
    username,
    email,
    name,
    image,
    following: [],
    followers: [],
    bookmarks: [],
  });
}

export async function getUserByUsername(username: string) {
  return client.fetch(
    `*[_type == "user" && username == "${username}"][0]{
      ...,
      "id":_id,
      following[]->{username, image},
      follower[]->{username, image},
      "bookmarks":bookmarks[]->_id
    }`
  );
}

export async function searchUsers(keyword?: string) {
  const query = keyword ? `&& (name match "${keyword}") || (username match "${keyword}")` : '';

  return client
    .fetch(
      `*[_type == "user" ${query}]{
    ...,
    "following": count(following),
    "followers": count(followers),
  }`
    )
    .then((users) =>
      users.map((user: SearchUser) => ({
        ...user,
        following: user.following ?? 0,
        followers: user.followers ?? 0,
      }))
    );
}

export async function getUserForProfile(username: string) {
  return client
    .fetch(
      `*[_type == "user" && username == "${username}"][0]{
      ...,
      "id":_id,
      "following": count(following),
      "followers": count(followers),
      "posts": count(*[_type=="post" &&  author->username == "${username}"])
    }`
    )
    .then((user) => ({ ...user, following: user.following ?? 0, followers: user.followers ?? 0, posts: user.posts ?? 0 }));
}

export async function addBookmark(userId: string, postId: string) {
  return (
    client
      .patch(userId) // patch할 data
      .setIfMissing({ bookmarks: [] }) // bookmarks가 없다면 []로 설정
      // bookmarks가 있으면 append
      .append('bookmarks', [
        // bookmarks 배열에 배열 추가하기
        {
          _ref: postId, // 추가하고자 하는 객체의 ref
          _type: 'reference', // 추가하고자 하는 객체의 type
        },
      ])
      .commit({ autoGenerateArrayKeys: true })
  ); // 다 되면 commit
}

export async function removeBookmark(userId: string, postId: string) {
  return client
    .patch(userId)
    .unset([`bookmarks[_ref=="${postId}"]`])
    .commit();
}

export async function follow(myId: string, targetId: string) {
  return client
    .transaction()
    .patch(
      myId,
      (user) =>
        user
          .setIfMissing({ following: [] }) // following이 비어있다면 []로 세팅
          .append('following', [{ _ref: targetId, _type: 'reference' }]) // following 배열에 객체 추가하기
    )
    .patch(
      targetId,
      (user) =>
        user
          .setIfMissing({ followers: [] }) // followers 비어있다면 []로 세팅
          .append('followers', [{ _ref: myId, _type: 'reference' }]) // followers 배열에 객체 추가하기
    )
    .commit({ autoGenerateArrayKeys: true });
}

export async function unfollow(myId: string, targetId: string) {
  return client
    .transaction()
    .patch(
      myId,
      (user) => user.unset([`following[_ref=="${targetId}"]`]) // following 배열에 객체 삭제하기
    )
    .patch(
      targetId,
      (user) => user.unset([`followers[_ref=="${myId}"]`]) // followers 배열에 객체 삭제하기
    )
    .commit({ autoGenerateArrayKeys: true });
}
