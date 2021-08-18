import TwitchApi from "../lib/TwitchApi";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link, Text, Box } from "@chakra-ui/react";
import moment from "moment";

const imageHeight = 400;
const imageWidth = 600;

export default function VodPanel(props) {
  const channel = props.channel;
  const channelUrl = `https://www.twitch.tv/${channel.user_name}`

  channel.thumbnail_url = channel.thumbnail_url
          .replace("{height}", imageHeight)
          .replace("{width}", imageWidth);

  return (
    <Link href={channelUrl} isExternal>
      <Box
        maxW="xl"
        cursor="pointer"
        borderWidth="md"
        borderRadius="lg"
        overflow="hidden"
      >
        <Image
          src={channel.thumbnail_url}
          height={imageHeight}
          width={imageWidth}
        />
        <Text>
          <b>{channel.title}</b>
        </Text>
        <Text>
          <b>{channel.user_name}</b> - {channel.game_name}
        </Text>
        <Text>
          Started {moment(channel.started_at).fromNow()}
        </Text>
      </Box>
    </Link>
  );
}
