'use client';

import { AuthUser } from '@/model/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useRef, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import PostUserAvatar from './PostUserAvatar';
import Button from './ui/Button';
import FilesIcon from './ui/FilesIcon';

type Props = {
  user: AuthUser;
};

export default function NewPost({ user: { username, image } }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

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
    } else if (e.type === 'dragleave') {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', textRef.current?.value ?? '');

    fetch('/api/posts', { method: 'POST', body: formData })
      .then((res) => {
        if (!res.ok) {
          setError(`${res.status} ${res.statusText}`);
          return;
        }
        router.push('/');
      })
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <section className="w-full max-w-xl flex flex-col items-center mt-6">
      {loading && (
        <div className="absolute inset-0 z-20 text-center pt-[20%] bg-sky-500/20">
          <PropagateLoader />
        </div>
      )}
      {error && <p className="w-full bg-red-100 text-red-600 text-center p-4 mb-4">{error}</p>}
      <PostUserAvatar username={username} image={image ?? ''} />
      <form onSubmit={handleSubmit} className="w-full flex flex-col mt-2 gap-2">
        <input onChange={handleChange} className="hidden" type="file" name="input" id="input-upload" accept="image/*" />
        <label className={`w-full h-60 flex flex-col items-center justify-center cursor-pointer ${!file && 'border-2 border-sky-500 border-dashed'}`} htmlFor="input-upload" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDragOver} onDrop={handleDrop}>
          {dragging && <div className="absolute inset-0 z-10 bg-sky-500/20 pointer-events-none"></div>}
          {!file && (
            <div className="flex flex-col items-center pointer-events-auto">
              <FilesIcon />
              <p>Drag and Drop your image here or click</p>
            </div>
          )}
          {file && (
            <div className="relative w-full aspect-square">
              <Image className="object-contain" src={URL.createObjectURL(file)} alt="local file" fill sizes="650px" />
            </div>
          )}
        </label>
        <textarea ref={textRef} className="outline-none text-lg border border-x-neutral-300" name="text" id="input-text" required rows={10} placeholder={'Write a caption...'} />
        <Button text="Publish" onClick={() => {}} />
      </form>
    </section>
  );
}
