"use client";
export default function error({ error }: { error: Error }) {
  return <div className="m-7">{error.message}</div>;
}
