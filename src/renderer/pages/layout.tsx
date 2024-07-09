import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  path: string;
}

const Links = [
  { label: 'Dossiers', href: '/stats' },
  { label: 'Tableau de bord', href: '/stats' },
];

export function NavLink(props: Props) {
  const { children, path } = props;
  const navigate = useNavigate();
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href="#"
    >
      <Button onClick={() => navigate(path)}>{children}</Button>
    </Box>
  );
}

export function WithAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const openNewInvestigationFile = () => {
    navigate('new-investigation-file');
  };
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box>Logo</Box>
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.label} path={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <Button
              variant="solid"
              colorScheme="teal"
              size="sm"
              mr={4}
              onClick={openNewInvestigationFile}
              leftIcon={<AddIcon />}
            >
              Nouveau dossier
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Mon profile</MenuItem>
                <MenuItem>Paramètres...</MenuItem>
                <MenuDivider />
                <MenuItem>Se déconnecter</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.label} path={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>
        <Outlet />
      </Box>
    </>
  );
}
