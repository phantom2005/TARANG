"use client";
import React from 'react'
import MagicBento from "../../../components/ui/registerbento"

export default function Register(){
     return(
        <> {/* This is a React Fragment */}
            <div> register ka page</div>
            <div>
                <MagicBento
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={120}
                    glowColor="132, 0, 255"
                />
            </div>
        </>
    )
}