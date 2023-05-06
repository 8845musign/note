"use client";

import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  // isSubmitting: メッセージ送信中かどうかのフラグ。GPTの返答待ちの間「・・・」のアニメーションを表示
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlLoaded, setUrlLoaded] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      // ChatGPT APIと通信
      const response = await fetch("/api/extractKeyword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      console.log(data);
      // urlをセット
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white md:rounded-lg my-10 mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 border-t border-gray-200"
      >
        <input
          type="text"
          value={url}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="メッセージを入力..."
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        >
          送信
        </button>
      </form>

      {urlLoaded !== '' ? <iframe src={urlLoaded} /> : null}
    </div>
  );
}

export default Home;