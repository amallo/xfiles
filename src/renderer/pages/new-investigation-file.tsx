/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/prefer-default-export */

'use client';

import { useState } from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  SimpleGrid,
  InputGroup,
  FormHelperText,
  InputRightElement,
  useToast,
  Text,
} from '@chakra-ui/react';

type NewFolderFormProps = {
  customerName: string;
  onCustomerChange: (customer: string) => void;
};
function NewFolderForm({ onCustomerChange, customerName }: NewFolderFormProps) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
        Nouveau dossier
      </Heading>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight="normal">
            Nom du dossier
          </FormLabel>
          <Input
            id="first-name"
            placeholder="Nom du dossier"
            value={customerName}
            onChange={(e) => onCustomerChange(e.target.value)}
          />
        </FormControl>
      </Flex>
      <Flex>
        <FormControl mt="2%">
          <FormLabel htmlFor="email" fontWeight="normal">
            Email de contact
          </FormLabel>
          <Input id="email" type="email" />
          <FormHelperText>Nous ne partageons pas votre email.</FormHelperText>
        </FormControl>
      </Flex>
      <FormControl>
        <FormLabel htmlFor="password" fontWeight="normal" mt="2%">
          Protéger l'accès par un mot de passe ?
        </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            placeholder="Mot de passe"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Cacher' : 'Afficher'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </>
  );
}

type UploadDocumentsFormProps = {
  folder: string;
  onFolderSelected: (folder: string) => void;
};
function UploadDocumentsForm({
  onFolderSelected,
  folder,
}: UploadDocumentsFormProps) {
  const showOpenFolderDialog = async () => {
    const result = await window.electron.ipcRenderer.showOpenFolderDialog();
    if (result.canceled) return Promise.resolve();
    return onFolderSelected(result.filePaths[0]);
  };
  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
        Vos documents
      </Heading>
      <FormControl isInvalid={false} isRequired>
        <FormLabel mb={2}>Sélectionnez le répertoire du dossier</FormLabel>
        {folder && folder.length > 0 && <Text>{folder}</Text>}
        <Input
          type="file"
          multiple
          mb={2}
          onClick={() => showOpenFolderDialog()}
        />
      </FormControl>
    </>
  );
}

type Form3Props = {
  customer: string;
  folder: string;
};
function Form3({ customer, folder }: Form3Props) {
  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal">
        Prêt à générer l'inventaire ?
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[3, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}
          >
            Client: {customer}
          </FormLabel>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}
          >
            Dossier: {folder}
          </FormLabel>
        </FormControl>
      </SimpleGrid>
    </>
  );
}

export function MultistepForm() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [folder, setFolder] = useState('');
  const handleCustomerSubmit = async () => {
    return window.electron.ipcRenderer.createCustomer(customerName);
  };
  const handleFolderSubmit = async () => {
    return window.electron.ipcRenderer.addDocuments(customerName, folder);
  };
  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      p={6}
      m="10px auto"
      as="form"
    >
      <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
      {step === 1 && (
        <NewFolderForm
          onCustomerChange={setCustomerName}
          customerName={customerName}
        />
      )}
      {step === 2 && (
        <UploadDocumentsForm folder={folder} onFolderSelected={setFolder} />
      )}
      {step === 3 && <Form3 customer={customerName} folder={folder} />}
      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={() => {
                setStep(step - 1);
                setProgress(progress - 33.33);
              }}
              isDisabled={step === 1}
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%"
            >
              Précédent
            </Button>
            <Button
              w="7rem"
              isDisabled={step === 3}
              onClick={() => {
                if (step === 1) {
                  handleCustomerSubmit();
                }
                if (step === 2) {
                  handleFolderSubmit();
                }
                setStep(step + 1);
                if (step === 3) {
                  setProgress(100);
                } else {
                  setProgress(progress + 33.33);
                }
              }}
              colorScheme="teal"
              variant="outline"
            >
              Suivant
            </Button>
          </Flex>
          {step === 3 ? (
            <Button
              w="7rem"
              colorScheme="red"
              variant="solid"
              onClick={async () => {
                await window.electron.ipcRenderer.generateDatasource(
                  customerName,
                );
                toast({
                  title: 'Nouveau dossier ajouté.',
                  description: "vous pouvez maintenant générer l'inventaire.",
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              Générer
            </Button>
          ) : null}
        </Flex>
      </ButtonGroup>
    </Box>
  );
}
