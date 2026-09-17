"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { legacyProfileDestination, type QueryValue } from "@/app/profile-navigation";

export function LegacyProfileLinks({ tab }: { tab: QueryValue }) {
  const router = useRouter();

  useEffect(() => {
    // The old Documents page contained both collections; the hash identifies which one.
    function followLegacyLink() {
      const destination = legacyProfileDestination(tab, window.location.hash);
      if (destination) router.replace(destination);
    }
    followLegacyLink();
    window.addEventListener("hashchange", followLegacyLink);
    return () => window.removeEventListener("hashchange", followLegacyLink);
  }, [router, tab]);

  return null;
}
