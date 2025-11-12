import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Modal from './components/Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWhatWeDo, setShowWhatWeDo] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {!showWhatWeDo ? (
        <>
          <header className="fixed top-0 left-0 right-0 bg-white z-40">
            <div className="max-w-[700px] mx-auto px-6 md:px-12 py-3 md:py-4 flex items-center justify-between">
              <img
                src="/logo.png"
                alt="Agency Logo"
                className="h-10 md:h-14 w-auto"
              />
              <button
                onClick={() => setShowWhatWeDo(true)}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm md:text-base transition-colors"
              >
                What We Do
              </button>
            </div>
          </header>

          <main className="max-w-[700px] mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-8 md:pb-12 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-[32px] leading-[1.1] md:text-[64px] font-bold text-[#1a1a1a] mb-6 md:mb-8">
                21 days. Idea to revenue.
              </h1>

              <p className="text-base md:text-[22px] leading-[1.6] text-[#4a4a4a] mb-8 md:mb-10">
                We think like your cofounder, build like your CTO.
                <br />
                3-4 week builds. $20k+ client revenue. AI-first tools
                <br className="hidden md:block" /> that replace manual processes.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white font-medium text-base md:text-lg py-4 px-8 md:px-10 rounded-xl hover:bg-blue-700 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl mb-4 md:mb-5"
              >
                Tell Me What You're Building →
              </button>

              <p className="text-sm md:text-base text-[#6a6a6a]">
                Voice note in 24h: what you need, timeline, fit.
              </p>

              <p className="text-sm md:text-[15px] italic text-[#6a6a6a]/70 mt-2 md:mt-3">
                You know what you want. We cut the BS. This page reflects that.
              </p>

              <div className="mt-12 md:mt-16">
                <p className="text-xs md:text-sm text-[#6a6a6a]/50 uppercase tracking-wider mb-6 md:mb-8">
                  Trusted by founders at
                </p>
                <div className="relative w-full">
                  <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-8 md:gap-12 animate-scroll" style={{ width: 'fit-content' }}>
                      <img
                        src="/bolt.png"
                        alt="Bolt"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '36px', width: 'auto' }}
                      />
                      <img
                        src="/beacon-house.png"
                        alt="Beacon House"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '42px', width: 'auto' }}
                      />
                      <img
                        src="/directshelf.png"
                        alt="DirectShelf"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/dreamvid.png"
                        alt="DreamVid"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/fractalhive.png"
                        alt="Fractal Hive"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/tripture.png"
                        alt="Tripture"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '36px', width: 'auto' }}
                      />
                      <img
                        src="/poai.png"
                        alt="Po AI"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/bolt.png"
                        alt="Bolt"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '36px', width: 'auto' }}
                      />
                      <img
                        src="/beacon-house.png"
                        alt="Beacon House"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '42px', width: 'auto' }}
                      />
                      <img
                        src="/directshelf.png"
                        alt="DirectShelf"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/dreamvid.png"
                        alt="DreamVid"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/fractalhive.png"
                        alt="Fractal Hive"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                      <img
                        src="/tripture.png"
                        alt="Tripture"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '36px', width: 'auto' }}
                      />
                      <img
                        src="/poai.png"
                        alt="Po AI"
                        className="flex-shrink-0 opacity-40 grayscale"
                        style={{ height: '40px', width: 'auto' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      ) : (
        <>
          <header className="fixed top-0 left-0 right-0 bg-white z-40">
            <div className="max-w-[700px] mx-auto px-6 md:px-12 py-3 md:py-4 flex items-center justify-between">
              <button
                onClick={() => setShowWhatWeDo(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm md:text-base transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <img
                src="/logo.png"
                alt="Agency Logo"
                className="h-10 md:h-14 w-auto"
              />
              <div className="w-12" />
            </div>
          </header>

          <main className="max-w-[700px] mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-8 md:pb-12 min-h-screen flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-12 md:mb-16">
              What We Do
            </h2>

            <div className="space-y-8 md:space-y-12">
              <div className="space-y-3">
                <div className="text-4xl md:text-5xl font-bold text-blue-600">$500</div>
                <h3 className="font-bold text-xl md:text-2xl text-[#1a1a1a]">Landing Pages</h3>
                <p className="text-base md:text-lg text-[#4a4a4a] leading-relaxed">
                  High-converting pages that turn visitors into customers. Minimal friction, maximum clarity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-4xl md:text-5xl font-bold text-blue-600">$1.5k-4k</div>
                <h3 className="font-bold text-xl md:text-2xl text-[#1a1a1a]">MVPs</h3>
                <p className="text-base md:text-lg text-[#4a4a4a] leading-relaxed">
                  Ship fast, validate ideas. We build the core features you need to get to market.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-4xl md:text-5xl font-bold text-blue-600">$2k+/mo</div>
                <h3 className="font-bold text-xl md:text-2xl text-[#1a1a1a]">Retainers</h3>
                <p className="text-base md:text-lg text-[#4a4a4a] leading-relaxed">
                  Ongoing support. We scale your product, improve performance, and own the roadmap.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowWhatWeDo(false)}
              className="mt-12 md:mt-16 bg-blue-600 text-white font-medium text-base md:text-lg py-4 px-8 md:px-10 rounded-xl hover:bg-blue-700 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl w-full"
            >
              Tell Me What You're Building →
            </button>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
