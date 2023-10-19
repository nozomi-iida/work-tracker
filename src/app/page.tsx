"use client";

import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PdfDocument } from "@/components/pdfDocument";
import { TimeTracker } from "@/types";
import { PDFDownloadLink } from "@react-pdf/renderer";

const WORK_TIME = "WORK_TIME";

export default function Home() {
  const [data, setData] = useState<TimeTracker[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const onCheckIn = () => {
    const now = new Date().toLocaleString(undefined, {
      timeZone: "Australia/Sydney",
    });
    const newData = [...data, { id: uuidv4(), started_at: now }];
    localStorage.setItem(WORK_TIME, JSON.stringify(newData));
    setData(newData);
    setIsWorking(true);
  };

  const onCheckOut = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = new Date().toLocaleString(undefined, {
      timeZone: "Australia/Sydney",
    });
    data[data.length - 1].ended_at = now;
    data[data.length - 1].description = textareaRef.current?.value;
    const newData = [...data];
    localStorage.setItem(WORK_TIME, JSON.stringify(newData));
    setData(newData);
    setIsWorking(false);
  };

  const caluculateWorkTime = (item: TimeTracker) => {
    if (!item.ended_at) return;
    const start = dayjs(item.started_at);
    const end = dayjs(item.ended_at);
    const diff = end.diff(start, "minute");
    return diff;
  };

  useEffect(() => {
    const strageData = localStorage.getItem(WORK_TIME);
    if (strageData) {
      const data = JSON.parse(strageData);
      setData(data);
      data.forEach((item: TimeTracker) => {
        if (!item.ended_at) {
          setIsWorking(true);
        }
      });
    }
  }, []);

  return (
    <main>
      <div className="flex space-x-4">
        <Button variant="secondary" onClick={onCheckIn} disabled={isWorking}>
          Check In
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!isWorking}>
              Check Out
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check Out</DialogTitle>
            </DialogHeader>
            <form onSubmit={onCheckOut}>
              <Textarea ref={textareaRef} className="mb-8" />
              <DialogClose asChild>
                <Button variant="outline" type="submit">
                  Check Out
                </Button>
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Download</Button>
          </DialogTrigger>
          <DialogContent className="min-w-[90%]">
            <DialogHeader>
              <DialogTitle>Download PDF</DialogTitle>
            </DialogHeader>
            <div className="flex justify-between gap-4 items-end ">
              <div className="flex-auto min-h-[80vh] h-full bg-gray-300 p-4">
                <div className="bg-white h-full">
                  <PdfDocument data={data} />
                </div>
              </div>
              <DialogClose asChild>
                <PDFDownloadLink
                  fileName="test.pdf"
                  document={<PdfDocument data={data} />}
                >
                  <Button variant="outline">Download</Button>
                </PDFDownloadLink>
              </DialogClose>
            </div>
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
  );
}
