'use client';

import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useRef, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const WORK_TIME = "WORK_TIME";

type TimeTracker = {
  id: string;
  started_at: string;
  ended_at?: string;
  description?: string;
}

export default function Home() {
  const [data, setData] = useState<TimeTracker[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const onCheckIn = () => {
    const now = new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney"});
    const newData = [...data, {id: uuidv4(), started_at: now}];
    localStorage.setItem(WORK_TIME, JSON.stringify(newData));
    setData(newData);
    setIsWorking(true);
  }

  const onCheckOut = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney"});
    data[data.length - 1].ended_at = now;
    data[data.length - 1].description = textareaRef.current?.value;
    const newData = [...data];
    localStorage.setItem(WORK_TIME, JSON.stringify(newData));
    setData(newData);
    setIsWorking(false);
  }

  const caluculateWorkTime = (item: TimeTracker) => {
    if (!item.ended_at) return;
    const start = dayjs(item.started_at);
    const end = dayjs(item.ended_at);
    const diff = end.diff(start, "minute");
    return diff;
  }

  useEffect(() => {
    const strageData = localStorage.getItem(WORK_TIME);
    if (strageData) {
      const data = JSON.parse(strageData);
      setData(data);
      data.forEach((item: TimeTracker) => {
        if (!item.ended_at) {
          setIsWorking(true);
        }
      })
    }
  }, [])

  return (
    <main>
      <div className="flex space-x-4">
        <Button variant="secondary" onClick={onCheckIn} disabled={isWorking}>Check In</Button>
              <Dialog>
          <DialogTrigger asChild>
        <Button variant="outline">Check Out</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Check Out</DialogTitle></DialogHeader>
            <form onSubmit={onCheckOut}>
              <Textarea ref={textareaRef} className="mb-8" />
              <DialogClose asChild>

        <Button variant="outline">Check Out</Button>
              </DialogClose>
            </form>
          </DialogContent>
      </Dialog>
      </div>
      {data.map((item) => (
        <div key={item.started_at} className="flex gap-8">
          <p>{dayjs(item.started_at).format("YYYY/MM/DD")}</p>
          <p>WorkTime: {caluculateWorkTime(item)}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </main>
  )
}
