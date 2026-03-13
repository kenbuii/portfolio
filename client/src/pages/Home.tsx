import Layout from "@/components/Layout";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col" style={{ fontFamily: "var(--font-home)" }}>
        <Hero />
      </div>
    </Layout>
  );
}
