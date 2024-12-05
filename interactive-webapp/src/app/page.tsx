import BlockTemplate from "@/components/BlockTemplate";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-primary-background text-[#ebebeb] px-10">
      <div className="flex">
        <div className="h-10 w-10 border-danger rounded-full"></div>
        <div className="h-10 w-10 border-warning rounded-full"></div>
        <div className="h-10 w-10 border-success rounded-full"></div>
        <div className="h-10 w-10 border-info rounded-full"></div>
      </div>
      <BlockTemplate />
    </div>
  );
}
