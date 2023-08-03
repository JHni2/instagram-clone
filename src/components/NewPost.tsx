'use client';

import { AuthUser } from '@/model/user';
import React, { useState } from 'react';
import PostUserAvatar from './PostUserAvatar';
import Button from './ui/Button';
import FilesIcon from './ui/FilesIcon';

type Props = {
  user: AuthUser;
};

export default function NewPost({ user: { username, image } }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.type === 'dragenter') {
      setDragging(true);
    } else if (e.type === 'dreagleave') {
      setDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <section>
      <PostUserAvatar username={username} image={image ?? ''} />
      <form>
        <input onChange={handleChange} className="hidden" type="file" name="input" id="input-upload" accept="image/*" />
        <label htmlFor="input-upload" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDragOver} onDrop={handleDrop}>
          <FilesIcon />
          <p>Drag and Drop your image here or click</p>
        </label>
        <textarea name="text" id="input-text" required rows={10} placeholder={'Write a caption...'} />
      </form>
      <Button text="Publish" onClick={() => {}} />
    </section>
  );
}
