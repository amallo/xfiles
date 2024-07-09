/* eslint-disable import/prefer-default-export */

'use client';

import {
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';

interface StatsCardProps {
  title: string;
  stat: string;
}
export function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py="5"
      shadow="xl"
      border="1px solid"
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded="lg"
    >
      <StatLabel fontWeight="medium" isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize="2xl" fontWeight="medium">
        {stat}
      </StatNumber>
    </Stat>
  );
}

