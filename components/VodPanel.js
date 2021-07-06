import TwitchApi from "../lib/TwitchApi";
import React, {useState, useEffect} from 'react';
import Image from 'next/image'
import Link from 'next/link'
import {Text} from "@chakra-ui/react";
const imageHeight = 400
const imageWidth = 600

const millisInDay = 86400000;

export default function VodPanel(props) {
    // TODO - useState/useEffect hooks
    // TODO - split into own file
    const [vod, setVod] = useState({});

    useEffect(async () => {
        if (!vod.title) {
            const vods = await TwitchApi.getVodsForChannel(props.channel, props.token.access_token, props.clientId)
            const latestVod = vods.data[0]
            if (latestVod && Date.now() - Date.parse(latestVod.created_at) < millisInDay && latestVod.thumbnail_url) {
                latestVod.thumbnail_url = latestVod.thumbnail_url.replace("%{height}", imageHeight).replace("%{width}", imageWidth)
                setVod(latestVod)
            }
        }
    });

    if (!vod.title) {
        return null
    }
    return (
        <div >
            <pre id="json">
                {JSON.stringify(vod, undefined, 2)}
            </pre>
            <Link href={vod.url}>
                <Image src={vod.thumbnail_url} height={imageHeight} width={imageWidth} />
            </Link>
            <Text><b>{vod.user_name}</b> - {vod.title}</Text>
        </div>
    );
}