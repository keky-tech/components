'use client'

import React, { useState } from 'react'
import { useDrag, useDrop } from "react-dnd";
import {Card, Flex, Avatar, Box, Text, Container} from "@radix-ui/themes";
export function DragAndDrop ({children}: {children: React.ReactNode}) : React.ReactElement {
  return (
    <div className="container md:mx-auto">
      {children}
    </div>
  )
}

export function Draggable ({children}: { children: React.ReactNode}) : React.ReactElement {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <Container ref={drag} size="3" style={{border: isDragging ? "1px dotted red" : "none"}}>
      <Card size="4" style={{ width: 500 }}>
        <Flex gap="4" align="center">
          <Avatar
            size="3"
            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            radius="full"
            fallback="T"
          />
          <Box>
            <Text as="div" size="2" color="gray">
              {children}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Container>

  );
}

export function DropZone ({children}: {children: React.ReactNode}): React.ReactElement {
  const [board, setBoard] = useState<React.JSX.Element[]>([<></>]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "block",
    drop: (item) => addBlockToBoard(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addBlockToBoard = (item: any): void => {
    setBoard(el => [...el, <Draggable key={el.length.toString()}>Item n° {el.length.toString()}</Draggable>])
  };
  return (
    <>
      <Container className="h-96 w-full bg-gray-400 mt-4" ref={drop}>
        {board}
      </Container>
      <div className="underline decoration-solid mt-4 text-center">{children}</div>
    </>

  );
}
