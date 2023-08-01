import { SimplePost } from '@/model/post';
import { client, urlFor } from './sanity';

const simplePostProjection = `
  ...,
  "username": author->username,
  "userImage": author->image,
  "image": photo,
  "likes": likes[]->username,
  "text": comments[0].comment,
  "comments": count(comments),
  "id": _id,
  "createdAt":_createdAt
`;

export async function getFollowingPostsOf(username: string) {
  return client
    .fetch(
      `*[_type == "post" && author->username == "${username}"
    || author._ref in *[_type == "user" && username == "${username}"].following[]._ref]
    | order(_createdAt desc){${simplePostProjection}}`
    )
    .then(mapPosts);
}

export async function getPost(id: string) {
  return client
    .fetch(
      `*[_type == "post" && _id == "${id}"][0]{
      ...,
      "username": author->username,
      "userImage": author->image,
      "image": photo,
      "likes": likes[]->username,
      comments[]{comment, "username": author->username, "image": author->image},
      "id":_id,
      "createdAt":_createdAt
    }`
    )
    .then((post) => ({ ...post, image: urlFor(post.image) }));
}

export async function getPostsOf(username: string) {
  return client
    .fetch(
      `*[_type == "post" && author->username == "${username}"]
  | order(_createdAt desc){
    ${simplePostProjection}
  }`
    )
    .then(mapPosts);
}

export async function getLikedPostsOf(username: string) {
  return client
    .fetch(
      `*[_type == "post" && "${username}" in likes[]->username]
  | order(_createdAt desc){
    ${simplePostProjection}
  }`
    )
    .then(mapPosts);
}

export async function getSavedPostsOf(username: string) {
  return client
    .fetch(
      `*[_type == "post" && _id in  *[_type == "user" && username == "${username}"].bookmarks[]._ref]
  | order(_createdAt desc){
    ${simplePostProjection}
  }`
    )
    .then(mapPosts);
}

function mapPosts(posts: SimplePost[]) {
  return posts.map((post: SimplePost) => ({ ...post, likes: post.likes ?? [], image: urlFor(post.image) }));
}

export async function likePost(postId: string, userId: string) {
  return (
    client
      .patch(postId) // patch할 data
      .setIfMissing({ likes: [] }) // likes가 없다면 []로 설정
      // likes가 있으면 append
      .append('likes', [
        // likes 배열에 배열 추가하기
        {
          _ref: userId, // 추가하고자 하는 객체의 ref
          _type: 'reference', // 추가하고자 하는 객체의 type
        },
      ])
      .commit({ autoGenerateArrayKeys: true })
  ); // 다 되면 commit
}

export async function dislikePost(postId: string, userId: string) {
  return client
    .patch(postId)
    .unset([`likes[_ref=="${userId}"]`])
    .commit();
}
