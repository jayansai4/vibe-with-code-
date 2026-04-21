/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono flex flex-col">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <header className="w-full p-6 flex items-center justify-center border-b border-cyan-900/30 bg-slate-950/50 backdrop-blur-sm z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
          <h1 className="text-3xl font-bold tracking-[0.2em] text-cyan-400 text-glow-cyan uppercase">
            Cyber<span className="text-fuchsia-500 text-glow-fuchsia">Serpent</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-12 p-6 md:p-12 z-10 w-full max-w-7xl mx-auto">
        <section className="flex-1 flex items-center justify-center w-full">
          <SnakeGame />
        </section>
        
        <aside className="w-full xl:w-96 flex-shrink-0 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-fuchsia-500 rounded-full box-glow-fuchsia animate-pulse" />
              SYSTEM AUDIO
            </h2>
            <MusicPlayer />
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-sm xl:text-base text-slate-400 leading-relaxed shadow-lg">
            <h3 className="text-cyan-500 font-bold mb-2 tracking-widest border-b border-cyan-900 pb-2">OPERATION PROTOCOL</h3>
            <ul className="list-disc list-inside space-y-2 mt-4 text-xs font-mono">
              <li>Initialize connection to grid via interaction.</li>
              <li>Navigate serpent entity using WASD/Arrows.</li>
              <li>Consume energy nodes (red) to extend capability.</li>
              <li>Avoid grid boundaries and self-intersection.</li>
              <li>Press 'Space' or 'P' to pause execution flow.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
