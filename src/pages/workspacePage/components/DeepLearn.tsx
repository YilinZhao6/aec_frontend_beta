import { GlobeIcon, PaperclipIcon, FolderIcon, ArrowDown, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
const learningCards = [
  {
    id: 1,
    title: "Physical Understanding of Schrödinger Equation",
    tag: "Schrödinger Equation",
    tagColor: "bg-[#ffdd89]",
    image: null,
  },
  {
    id: 2,
    title: "Medieval History and Story of the Crusades",
    tag: "The Crusades",
    tagColor: "bg-[#96d8ff]",
    image: "/image-23.png",
  },
  {
    id: 3,
    title: "CRISPR Technology in the Context of Gene Editing and Specific Approach",
    tag: "CRISPR",
    tagColor: "bg-[#c2dcdc]",
    image: "/image-20.png",
  },
  {
    id: 4,
    title: "How to Make Oxygen from metals?",
    tag: "Oxygen",
    tagColor: "bg-[#96d8ff]",
    image: "/image-22.png",
  },
  {
    id: 5,
    title: "Explain to Me the Mechanism of Neuron Networks",
    tag: "Neuron Net",
    tagColor: "bg-[#f9aaaa]",
    image: "/image-21-1.png",
  },
  {
    id: 6,
    title: "Medieval History and Story of the Crusades",
    tag: "The Crusades",
    tagColor: "bg-[#96d8ff]",
    image: "/image-23.png",
  },
  {
    id: 7,
    title: "Explain to Me the Mechanism of Neuron Networks",
    tag: "Neuron Net",
    tagColor: "bg-[#f9aaaa]",
    image: "/image-21-1.png",
  },
  {
    id: 8,
    title: "Medieval History and Story of the Crusades",
    tag: "The Crusades",
    tagColor: "bg-[#c88eff]",
    image: "/image-23.png",
  },
];
function DeepLearn() {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const trendingTabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTrendingTabIndex, setActiveTrendingTabIndex] = useState<number | null>(0);
  const [trendingTabUnderlineWidth, setTrendingTabUnderlineWidth] = useState(0);
  const [trendingTabUnderlineLeft, setTrendingTabUnderlineLeft] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridColumns, setGridColumns] = useState(4);

  useEffect(() => {
    if (!gridRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setGridColumns(width < 800 ? 3 : 4);
      }
    });

    resizeObserver.observe(gridRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);

  useEffect(() => {
    if (activeTrendingTabIndex === null) {
      return;
    }

    const setTrendingTabPosition = () => {
      const currentTab = trendingTabsRef.current[activeTrendingTabIndex] as HTMLElement;
      setTrendingTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTrendingTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTrendingTabPosition();
  }, [activeTrendingTabIndex]);

  return (
    <main className="flex-1  lg:p-8 max-w-7xl mx-auto">
      {/* Logo and title */}
      <div className="mb-8 w-full">
        <div className="flex items-center justify-center gap-4 self-center w-full">
          <div className="w-[60px] h-[60px] ">
            <img
              className=" w-[60px] h-[60px] top-0 left-0"
              alt="icon"
              src="/main/landing_page/hyperknow_logo 1.svg"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="font-['Outfit',Helvetica] font-medium text-black text-2xl">
              Deep Learn
            </h2>
            <p className="font-['Outfit',Helvetica] font-medium text-black text-[13px]">
              making true understanding unprecedentedly easy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <GlobeIcon className="w-6 h-6" />
          <div className="flew-row flex h-[35px] rounded-3xl border border-none bg-[#ECF1F6] px-2 backdrop-blur-sm">
            <span
              className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-[6px] transition-all duration-300"
              style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
            >
              <span className="h-full w-full rounded-3xl bg-white" />
            </span>
            <button
              ref={(el) => (tabsRef.current[0] = el)}
              className={`${activeTabIndex === 0 ? `` : `hover:text-[#898989]`} cursor-pointer select-none rounded-full px-4 text-center font-medium text-sm text-[#898989]`}
              onClick={() => setActiveTabIndex(0)}
            >
              Deep Learn
            </button>
            <button
              ref={(el) => (tabsRef.current[1] = el)}
              className={`${activeTabIndex === 1 ? `` : `hover:text-[#898989]`} cursor-pointer select-none rounded-full px-4 text-center font-medium text-sm text-[#898989]`}
              onClick={() => setActiveTabIndex(1)}
            >
              Quick Search
            </button>
          </div>
        </div>
      </div>


      {/* Search input */}
      <Card className="w-full max-w-4xl mx-auto h-[155px] rounded-[13px] border-[#d0d9e3] shadow-[0px_3px_60px_1px_#4870d00d] mb-6">
        <CardContent className="flex flex-col px-5 py-2 w-full h-full">
          <Textarea
            className="flex-1 w-full resize-none font-medium font-['Outfit',Helvetica] text-[#969696] border-none px-0 focus:outline-none focus:ring-0 shadow-none placeholder:text-[#969696] text-base"
            placeholder="Enter the topic you'd like to learn..."
            rows={4}
          />

          <div className="flex flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <Input
              className="w-full sm:basis-[391px] h-[30px] bg-[#ecf1f6] rounded-[5px] text-xs font-medium font-['Outfit',Helvetica] text-[#898989] placeholder:text-[#969696]"
              placeholder="Enter additional comments..."
            />

            <div className="flex  gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-[25px] bg-[#edf2f7] rounded-lg text-xs font-medium text-[#6b6b6b] flex items-center gap-1"
              >
                <PaperclipIcon className="h-[18px] w-[18px]" />
                Profile
                <ChevronDown className="w-[9px] text-lg h-2.5 " />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-[25px] bg-[#ecf1f6] rounded-lg text-xs font-medium text-[#6b6b6b] flex items-center gap-1"
              >
                <FolderIcon className="h-[19px] w-[19px]" />
                <span className="hidden sm:inline">Reference From Drive</span>
                <span className="sm:hidden">Drive</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 justify-start ml-[140px]">
          <div className="flew-row flex h-[35px] rounded-3xl border border-none bg-[#ECF1F6] px-2 backdrop-blur-sm relative">
            <span
              className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-[6px] transition-all duration-300"
              style={{ left: trendingTabUnderlineLeft, width: trendingTabUnderlineWidth }}
            >
              <span className="h-full w-full rounded-3xl bg-white" />
            </span>
            <button
              ref={(el) => (trendingTabsRef.current[0] = el)}
              className={`${activeTrendingTabIndex === 0 ? `` : `hover:text-[#898989]`} cursor-pointer select-none rounded-full px-4 text-center font-medium text-sm text-[#898989]`}
              onClick={() => setActiveTrendingTabIndex(0)}
            >
              Trending
            </button>
            <button
              ref={(el) => (trendingTabsRef.current[1] = el)}
              className={`${activeTrendingTabIndex === 1 ? `` : `hover:text-[#898989]`} cursor-pointer select-none rounded-full px-4 text-center font-medium text-sm text-[#898989]`}
              onClick={() => setActiveTrendingTabIndex(1)}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Learning cards grid */}
      <div ref={gridRef} className={`grid gap-6 px-[100px]`} style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
        {Array.from({ length: gridColumns }).map((_, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-6">
            {learningCards
              .filter((_, index) => index % gridColumns === columnIndex)
              .slice(0, 2)
              .map((card) => (
                <Card
                  key={card.id}
                  className="w-full rounded-[10px] shadow-[0px_3px_60px_1px_#476fcf21] overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-0">
                    {card.image && (
                      <div className="flex justify-center pt-[15px]">
                        <img
                          className="w-[163px] h-[106px] object-cover rounded"
                          alt="Topic illustration"
                          src={card.image}
                        />
                      </div>
                    )}

                    <div className="p-3.5 pt-6">
                      <h3 className="font-['Outfit',Helvetica] font-medium text-[#0064a2] text-[13px] mb-4 line-clamp-3">
                        {card.title}
                      </h3>

                      <div
                        className={`${card.tagColor} rounded-[10px] px-2.5 py-1 inline-block`}
                      >
                        <span className="flex items-center  font-['Outfit',Helvetica] font-medium text-white text-[11px] ">
                          {card.tag}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ))}
      </div>
    </main>
  )
}

export default DeepLearn