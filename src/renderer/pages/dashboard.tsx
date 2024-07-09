/* eslint-disable import/prefer-default-export */
import { chakra, SimpleGrid, Box } from '@chakra-ui/react';
import { StatsCard } from '../components/stats';

export function BasicStatistics() {
  return (
    <Box maxW="7xl" mx="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1 textAlign="center" fontSize="4xl" py={10} fontWeight="bold">
        Vos statistiques
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title="Votre dernière utilisation" stat="Il y'a 2h" />
        <StatsCard title="Nombre de dossiers total" stat="34 dossiers" />
        <StatsCard title="Nouveaux dossiers ce mois-ci" stat="2 dossiers" />
        <StatsCard
          title="Dossier le plus consulté ce mois-ci"
          stat="Dossier DUVAL (30h)"
        />
        <StatsCard title="Dernier dossier créé" stat="Dossier DUVAL" />
      </SimpleGrid>
    </Box>
  );
}
