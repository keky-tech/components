import {ComponentWrapper} from "@/app/(sink)/page";
import DragAndDropDemo from "@/registry/example/drag-and-drop-demo";

export default function Test() {
  return (
    <div className="container">
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-start gap-4">
          <div className="grid gap-4">
            <ComponentWrapper>
              <DragAndDropDemo />
            </ComponentWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
