'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";

const WORK_TIME = "WORK_TIME";

type TimeTracker = {
  id: string;
  started_at: string;
  ended_at?: string;
}

export default function Home() {
  const [data, setData] = useState<TimeTracker[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const onCheckIn = () => {
    const now = new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney"});
    const newData = [...data, {id: uuidv4(), started_at: now}];
    localStorage.setItem(WORK_TIME, JSON.stringify(newData));
    setData(newData);
    setIsWorking(true);
  }
  const onCheckOut = () => {
    const now = new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney"});
    data[data.length - 1].ended_at = now;
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
        <Button variant="outline" onClick={onCheckOut}>Check Out</Button>
      </div>
      {data.map((item) => (
        <div key={item.started_at}>
          <p>{dayjs(item.started_at).format("YYYY/MM/DD")}</p>
          <p>WorkTime: {caluculateWorkTime(item)}</p>
        </div>
      ))}
    </main>
  )
}
