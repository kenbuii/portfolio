import { useState, useEffect } from "react";
import { getStoredProfile, Profile, defaultProfile } from "@/lib/data";
import { fetchProfile } from "@/lib/supabase";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";

export default function Hero() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        if (data?.name) setProfile(data);
      })
      .catch(() => {
        setProfile(getStoredProfile());
      })
      .finally(() => setLoading(false));
    
    const handleStorageChange = () => {
      setProfile(getStoredProfile());
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profile-updated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profile-updated", handleStorageChange);
    };
  }, []);

  if (loading) {
    return <LoadingScreen variant="suprematist" duration={1500} />;
  }

  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-24 lg:px-32 max-w-5xl mx-auto pt-24">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight leading-[1.1]">
          {profile.name}
        </h1>
        
        <div 
          className="leading-relaxed text-foreground/90 max-w-4xl [&_p]:my-4 [&_a]:text-secondary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_em]:italic"
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}
          dangerouslySetInnerHTML={{ __html: profile.bio }}
        />
      </div>
    </section>
  );
}
