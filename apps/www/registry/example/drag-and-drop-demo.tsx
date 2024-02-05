import React from 'react'
import {DragAndDrop, Draggable, DropZone} from "@/registry/ui/drag-and-drop";
import {cn} from "@/lib/utils";

export default function DragAndDropDemo() {
  return (
    <>
      <DragAndDrop>
        <Draggable>
          <span> Déplacer le block </span>
        </Draggable>
        <DropZone>
          <h3>Déplacer les blocks dans la zone grise ci-dessus </h3>
        </DropZone>
      </DragAndDrop>
    </>

  )
}
