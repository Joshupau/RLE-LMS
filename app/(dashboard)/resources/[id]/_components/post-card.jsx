

export const PostCard = ({description, uploadLinks, author}) => {
  return (
    <div className="m-4 md:w-[40rem] shadow-2xl border rounded border-gray-300  p-2 mx-auto flex items-center">
        <div className="">
            {description}
        </div>
    </div>
  )
}

