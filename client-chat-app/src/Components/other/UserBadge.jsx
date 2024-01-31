import React from 'react'
import { Box,Text ,Button, Badge } from '@chakra-ui/react' 
import { SmallCloseIcon } from '@chakra-ui/icons';
const UserBadge = ({user , handleDelete}) => {
  return (
    <>
      <Badge
        backgroundColor={"teal"}
        border={"1px"}
        padding={"5px"}
        borderRadius={"8px"}
        my={"8px"}
        display={"flex"}
        mx={"5px"}
        onClick={handleDelete}
      >
        <Text >{user.name}</Text>
         <SmallCloseIcon my={'4.5px'}  />
      </Badge>
    </>
  );
}

export default UserBadge
