"use client";

import { useTelemetry } from "@/hooks/useTelemetry";

export default function TelemetryProvider() {
    useTelemetry(); // Initialize the tracker

    // Renders absolutely nothing, just runs silently in the background
    return null;
}
