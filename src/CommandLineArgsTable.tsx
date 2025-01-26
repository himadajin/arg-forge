import React from 'react'
import {
  Code,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Argument, getCommandLineOptionString } from './parser'

interface CommandLineArgsTableProps {
  args: Argument[];
}

const CommandLineArgsTable: React.FC<CommandLineArgsTableProps> = ({
  args
}) => {
  return (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th>TYPE</Th>
          <Th>ARGUMENT</Th>
        </Tr>
      </Thead>
      <Tbody>
        {args.map((opt, index) => (
          <Tr key={index}>
            <Td>{opt.type}</Td>
            <Td><Code>{getCommandLineOptionString(opt)}</Code></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default CommandLineArgsTable;
