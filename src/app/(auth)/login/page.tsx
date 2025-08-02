"use client";
import React, { use } from 'react' // Make sure React is imported for <> fragment syntax
import MagicBento from "../../../components/ui/loginbento"

export default function Login(){
    return(
        <> {/* This is a React Fragment */}
            <div> login ka page</div>
            <div>
                <MagicBento
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={12}
                    glowColor="132, 0, 255"
                />
            </div>
        </>
    )
}