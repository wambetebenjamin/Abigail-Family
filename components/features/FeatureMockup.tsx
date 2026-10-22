import { Check, Download, FileText, Paperclip, Send } from 'lucide-react'

type MockupProps = { variant: 'calendar' | 'wallet' | 'handshake' | 'messages' | 'vault' | 'journal' }

const chip = 'rounded-full px-2 py-0.5 text-[10px] font-semibold'

export default function FeatureMockup({ variant }: MockupProps) {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-lg border border-line bg-white p-4 shadow-[0_20px_50px_-36px_rgba(37,37,37,0.4)] sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ffb3a0]" />
          <span className="h-2 w-2 rounded-full bg-[#ffd7a0]" />
          <span className="h-2 w-2 rounded-full bg-[#c5e8a0]" />
        </div>
        <span className="rounded bg-surface px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
          Abigail Family
        </span>
      </div>

      {variant === 'calendar' ? (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink">March</p>
            <p className="text-[10px] text-muted">Both parents</p>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[9px] text-muted">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, index) => {
              const day = index + 1
              const marked = [4, 9, 12, 17, 21, 24].includes(day)
              return (
                <div
                  key={day}
                  className={`flex aspect-square items-center justify-center rounded text-[9px] ${
                    marked ? 'bg-primary-soft font-semibold text-primary' : 'bg-surface text-muted'
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
          <div className="mt-3 rounded border border-line bg-white p-2">
            <p className="text-[10px] font-semibold text-ink">16:00 School pick-up</p>
            <p className="text-[9px] text-muted">Gate A, Brian is collecting</p>
          </div>
        </div>
      ) : null}

      {variant === 'wallet' ? (
        <div>
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Shared expenses</span>
            <span className="font-semibold text-ink">KSh 30,300</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              ['School fees', '24,500', 'A'],
              ['Medical', '3,200', 'B'],
              ['Uniforms', '4,600', 'A'],
              ['Swimming', '2,500', 'B'],
            ].map(([label, amount, parent]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded bg-surface px-2 py-1.5 text-[10px]"
              >
                <span className="text-slatedeep">{label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-muted">KSh {amount}</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[8px] font-bold text-primary">
                    {parent}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[9px] text-muted">
              <span>Paid by Amina</span>
              <span>Paid by Brian</span>
            </div>
            <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-sky/40">
              <span className="h-full w-[62%] rounded-l-full bg-primary" />
            </div>
          </div>
        </div>
      ) : null}

      {variant === 'handshake' ? (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Handover history
          </p>
          <ol className="mt-3 space-y-3 border-l border-line pl-3">
            {[
              ['18:00', 'School gate', 'Good spirits, slight cough'],
              ['08:15', 'Karen centre', 'Homework complete'],
              ['17:45', 'School gate', 'Happy and well rested'],
            ].map(([time, place, note]) => (
              <li key={time} className="relative">
                <span className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-[10px] font-semibold text-ink">
                  {time} <span className="font-normal text-muted">{place}</span>
                </p>
                <p className="text-[9px] text-muted">{note}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {variant === 'messages' ? (
        <div className="space-y-2">
          <div className="max-w-[80%] rounded-lg rounded-tl-sm bg-surface px-2.5 py-2 text-[10px] text-slatedeep">
            I can do the school pick-up on Thursday if that still works.
          </div>
          <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-primary px-2.5 py-2 text-[10px] text-white">
            Thank you. She has swimming at nine on Saturday.
          </div>
          <div className="max-w-[80%] rounded-lg rounded-tl-sm bg-surface px-2.5 py-2 text-[10px] text-slatedeep">
            Noted, I will update the calendar.
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5">
            <span className="flex-1 text-[9px] text-muted">Write a message</span>
            <Send className="h-3 w-3 text-primary" />
          </div>
        </div>
      ) : null}

      {variant === 'vault' ? (
        <div className="space-y-1.5">
          {[
            ['Custody agreement', 'PDF'],
            ['Term two report', 'PDF'],
            ['Immunisation card', 'JPG'],
          ].map(([name, type]) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded border border-line px-2 py-2 text-[10px]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-sky-soft text-sky">
                <FileText className="h-3 w-3" />
              </span>
              <span className="flex-1 text-slatedeep">{name}</span>
              <span className="text-[8px] text-muted">{type}</span>
              <Download className="h-3 w-3 text-muted" />
            </div>
          ))}
          <div className="mt-2 flex items-center justify-center gap-1 rounded border border-dashed border-line py-2 text-[9px] text-muted">
            <Paperclip className="h-3 w-3" /> Upload a document
          </div>
        </div>
      ) : null}

      {variant === 'journal' ? (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-ink">Private to you</p>
            <span className={`${chip} bg-leaf/10 text-leaf`}>Saved</span>
          </div>
          <div className="mt-3 rounded bg-surface p-2.5">
            <p className="text-[10px] font-semibold text-ink">She read a whole page</p>
            <p className="mt-1 text-[9px] leading-relaxed text-muted">
              Amani read the first page without help tonight. She read it twice, she was so proud.
            </p>
            <div className="mt-2 flex items-center gap-1 text-[8px] text-muted">
              <Check className="h-2.5 w-2.5 text-leaf" /> School achievement
            </div>
          </div>
          <div className="mt-2 flex gap-1">
            <span className="rounded bg-surface px-1.5 py-0.5 text-[8px] text-slatedeep">B</span>
            <span className="rounded bg-surface px-1.5 py-0.5 text-[8px] italic text-slatedeep">I</span>
            <span className="rounded bg-surface px-1.5 py-0.5 text-[8px] text-slatedeep">List</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
