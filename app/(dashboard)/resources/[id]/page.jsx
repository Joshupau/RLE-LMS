import Tiptap from "@/components/tiptap"
import { EditorCard } from "./_components/editor-card"


export default async function ResourceIdPage() {
  return (
    <div>
        <div className="flex flex-col items-center justify-center mt-20">
            <div>
              Banner
            </div>
            <div className="mt-10 w-full">
               <EditorCard />
            </div>
            <div>
              {/* TODO: Post Group */}
            </div>

        </div>
    </div>
  )
}

