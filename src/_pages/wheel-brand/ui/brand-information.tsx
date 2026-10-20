import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {WheelBrandView} from '../model/adapt-brand-data';

const notes = [
  {
    title: 'Size and width',
    text: 'Diameter and width have to be checked for the specific vehicle.',
  },
  {
    title: 'Bolt pattern and offset',
    text: 'Both need to match the car before a wheel can be fitted.',
  },
  {
    title: 'Brake clearance',
    text: 'The wheel needs room around the brakes. We confirm that with you.',
  },
];

const steps = [
  {number: '01', title: 'Choose a design', text: 'Find the look you love.'},
  {number: '02', title: 'Share your vehicle', text: 'Make, model and year.'},
  {number: '03', title: 'Confirm the details', text: 'Sizing, finish and availability.'},
];

export function BrandInformation({data}: {data: WheelBrandView}) {
  return (
    <>
      <section className="bg-[#F4F3EF] text-[#111315]" aria-labelledby="brand-guidance-title">
        <div className="mx-auto max-w-[1320px] px-[20px] pt-[28px] pb-[48px] min-[768px]:px-[24px] min-[1024px]:px-[48px] min-[1024px]:pt-[36px] min-[1024px]:pb-[72px]">
          {data.guidance.kind === 'construction' ? (
            <>
              <p className="m-0 text-[12px] font-medium tracking-[0.18em] text-[#55595E] uppercase">Two constructions</p>
              <h2 id="brand-guidance-title" className="m-0 mt-[12px] text-[32px] leading-[1.05] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[44px]">
                One piece. Or three.
              </h2>
              <div className="mt-[28px] grid gap-[16px] min-[900px]:grid-cols-2 min-[1024px]:mt-[36px] min-[1024px]:gap-[20px]">
                <article className="grid gap-[20px] rounded-[12px] bg-white p-[16px] min-[768px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[768px]:items-center min-[768px]:p-[20px]">
                  <div className="relative aspect-square">
                    <Image src={data.guidance.monoblockImage} alt={data.guidance.monoblockAlt} fill sizes="(min-width: 900px) 24vw, 80vw" className="object-contain" />
                  </div>
                  <div>
                    <h3 className="m-0 text-[24px] leading-[1.15] font-medium text-[#111315] [font-family:var(--font-display),sans-serif]">Monoblock</h3>
                    <p className="m-0 mt-[8px] text-[16px] leading-[1.5] text-[#55595E]">A wheel made as a single piece.</p>
                  </div>
                </article>
                <article className="grid gap-[20px] rounded-[12px] bg-white p-[16px] min-[768px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[768px]:items-center min-[768px]:p-[20px]">
                  <div className="flex aspect-square flex-col items-center justify-center">
                    <svg viewBox="0 0 160 160" className="h-[70%] w-[70%]" aria-hidden>
                      <circle cx="80" cy="80" r="62" fill="none" stroke="#C2C4C7" strokeWidth="8" />
                      <circle cx="80" cy="80" r="44" fill="none" stroke="#111315" strokeWidth="7" />
                      <circle cx="80" cy="80" r="18" fill="#CD202B" />
                    </svg>
                    <p className="m-0 text-[12px] font-medium tracking-[0.14em] text-[#55595E] uppercase">Schematic</p>
                  </div>
                  <div>
                    <h3 className="m-0 text-[24px] leading-[1.15] font-medium text-[#111315] [font-family:var(--font-display),sans-serif]">3-piece modular</h3>
                    <p className="m-0 mt-[8px] text-[16px] leading-[1.5] text-[#55595E]">A separate center, inner barrel and outer lip.</p>
                    <Link href="/contact/" className="wheel-brand-quiet mt-[16px] inline-flex min-h-[44px] items-center gap-[6px] text-[15px] font-medium text-[#111315]">
                      Ask which suits your car
                      <ArrowUpRight aria-hidden className="size-[16px]" />
                    </Link>
                  </div>
                </article>
              </div>
            </>
          ) : (
            <>
              <p className="m-0 text-[12px] font-medium tracking-[0.18em] text-[#55595E] uppercase">Before you choose</p>
              <h2 id="brand-guidance-title" className="m-0 mt-[12px] max-w-[16ch] text-[32px] leading-[1.05] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[44px]">
                Fit is confirmed per car.
              </h2>
              <p className="m-0 mt-[14px] max-w-[40rem] text-[16px] leading-[1.5] text-[#55595E] min-[1024px]:text-[18px]">
                These details change with the vehicle. Nothing here is a universal fitment.
              </p>
              <ul role="list" className="m-0 mt-[28px] grid list-none gap-[16px] p-0 min-[768px]:grid-cols-3 min-[1024px]:mt-[36px]">
                {notes.map((note) => (
                  <li key={note.title} className="rounded-[12px] bg-white p-[20px]">
                    <h3 className="m-0 text-[20px] leading-[1.2] font-medium text-[#111315] [font-family:var(--font-display),sans-serif]">{note.title}</h3>
                    <p className="m-0 mt-[8px] text-[15px] leading-[1.5] text-[#55595E]">{note.text}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="bg-white text-[#111315]" aria-labelledby="brand-steps-title">
        <div className="mx-auto grid max-w-[1320px] items-center gap-[28px] px-[20px] py-[40px] min-[768px]:px-[24px] min-[1024px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] min-[1024px]:px-[48px] min-[1024px]:py-[48px]">
          <h2 id="brand-steps-title" className="m-0 max-w-[12ch] text-[32px] leading-[1.05] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[40px]">
            From inspiration to the right fit.
          </h2>
          <ol className="m-0 grid list-none gap-[20px] p-0 min-[768px]:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number}>
                <p className="m-0 text-[13px] font-medium text-[#CD202B] tabular-nums">{step.number}</p>
                <h3 className="m-0 mt-[8px] text-[18px] leading-[1.25] font-medium text-[#111315] [font-family:var(--font-display),sans-serif]">{step.title}</h3>
                <p className="m-0 mt-[6px] text-[15px] leading-[1.45] text-[#55595E]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
