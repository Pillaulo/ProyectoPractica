import type { ReactNode } from 'react';

type Props = {
  title: string;
  right?: ReactNode;
  children: ReactNode;
};

export function Card({ title, right, children }: Props) {
  return (
    <section className="card">
      <div className="cardTitleRow">
        <h2 className="cardTitle">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

