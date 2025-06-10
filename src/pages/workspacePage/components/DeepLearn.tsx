import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { GlobeIcon, PaperclipIcon, FolderIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
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
  return (
    <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto">
      {/* Logo and title */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-[41px] h-[27px] flex-shrink-0">
          <img
            className="absolute w-[41px] h-[27px] top-0 left-0"
            alt="Vector"
            src="/vector.svg"
          />
          <img
            className="absolute w-10 h-[27px] top-0 left-[7px]"
            alt="Vector"
            src="/vector-2.svg"
          />
          <img
            className="absolute w-2.5 h-[5px] top-[-7px] left-[18px]"
            alt="Vector"
            src="/vector-1.svg"
          />
          <img
            className="absolute w-2.5 h-[5px] top-[28px] left-[18px]"
            alt="Vector"
            src="/vector-3.svg"
          />
        </div>

        <div className="flex-1">
          <h2 className="font-['Outfit',Helvetica] font-medium text-black text-2xl">
            Deep Learn
          </h2>
          <p className="font-['Outfit',Helvetica] font-medium text-black text-[13px]">
            making true understanding unprecedentedly easy
          </p>
        </div>

        {/* Language selector - moved to header area */}
        <div className="hidden lg:flex items-center gap-2">
          <GlobeIcon className="w-6 h-6" />
          <div className="w-[180px] h-[35px] bg-[#ecf1f6] rounded-[16.5px] flex items-center px-2">
            <div className="w-[84px] h-[26px] bg-white rounded-[14px] flex items-center justify-center">
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                Deep Learn
              </span>
            </div>
            <span className="ml-2 font-['Inter',Helvetica] font-medium text-[#949494] text-xs">
              Quick Search
            </span>
          </div>
        </div>
      </div>

      {/* Language selector for mobile */}
      <div className="lg:hidden flex items-center gap-2 mb-6">
        <GlobeIcon className="w-6 h-6" />
        <div className="flex-1 max-w-[280px] h-[35px] bg-[#ecf1f6] rounded-[16.5px] flex items-center px-2">
          <div className="w-[84px] h-[26px] bg-white rounded-[14px] flex items-center justify-center">
            <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
              Deep Learn
            </span>
          </div>
          <span className="ml-2 font-['Inter',Helvetica] font-medium text-[#949494] text-xs">
            Quick Search
          </span>
        </div>
      </div>

      {/* Search input */}
      <Card className="w-full max-w-4xl mx-auto h-[155px] rounded-[13px] border-[#d0d9e3] shadow-[0px_3px_60px_1px_#4870d00d] mb-6">
        <CardContent className="p-5">
          <Input
            className="h-12 text-base font-medium font-['Inter',Helvetica] text-[#969696] border-0 px-0 focus-visible:ring-0"
            placeholder="Enter the topic you'd like to learn..."
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10">
            <Input
              className="w-full sm:w-[391px] h-[30px] bg-[#ecf1f6] rounded-[5px] text-xs font-medium font-['Inter',Helvetica] text-[#898989]"
              placeholder="Enter additional comments..."
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-[25px] bg-[#edf2f7] rounded-lg text-xs font-medium text-[#6b6b6b] flex items-center gap-1"
              >
                <PaperclipIcon className="h-[18px] w-[18px]" />
                Profile
                <span className="w-[9px] h-2.5">▼</span>
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
        <Tabs defaultValue="trending">
          <TabsList className="w-[121px] h-[29px] bg-[#ecf1f6] rounded-lg">
            <TabsTrigger
              value="trending"
              className="w-[62px] h-5 bg-white rounded data-[state=active]:bg-white"
            >
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                Trending
              </span>
            </TabsTrigger>
            <TabsTrigger value="history">
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                History
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Learning cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {learningCards.map((card) => (
          <Card
            key={card.id}
            className="w-full max-w-[203px] mx-auto rounded-[10px] shadow-[0px_3px_60px_1px_#476fcf21] overflow-hidden hover:shadow-lg transition-shadow duration-200"
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
                <h3 className="font-['Inter',Helvetica] font-medium text-[#0064a2] text-[13px] mb-4 line-clamp-3">
                  {card.title}
                </h3>

                <div
                  className={`${card.tagColor} rounded-[10px] px-2.5 py-1 inline-block`}
                >
                  <span className="font-['Inter',Helvetica] font-medium text-white text-[11px]">
                    {card.tag}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

export default DeepLearn