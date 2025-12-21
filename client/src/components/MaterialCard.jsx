import { Button } from "./Button";

export const MaterialCard = ({ material, onDelete, isTeacher }) => {
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderContent = () => {
    switch (material.type) {
      case "youtube":
        const videoId = getYouTubeId(material.content);
        return (
          <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={material.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                Invalid Video URL
              </div>
            )}
          </div>
        );
      case "link":
        return (
          <div className="mb-4">
            <a
              href={material.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--duo-blue)] hover:underline break-all"
            >
              {material.content}
            </a>
          </div>
        );
      case "note":
        return (
          <div className="mb-4 p-4 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] whitespace-pre-wrap">
            {material.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {material.type === "youtube" && "🎥"}
            {material.type === "link" && "🔗"}
            {material.type === "note" && "📝"}
          </span>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">
            {material.title}
          </h3>
        </div>
        {isTeacher && (
          <button
            onClick={() => onDelete(material._id)}
            className="text-[var(--duo-red)] hover:text-red-400 p-1"
            title="Delete Material"
          >
            🗑️
          </button>
        )}
      </div>

      {material.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {material.description}
        </p>
      )}

      <div className="flex-grow">{renderContent()}</div>

      {material.type === "link" && (
        <div className="mt-auto pt-4">
          <a
            href={material.content}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn btn-primary no-underline flex items-center justify-center gap-2"
          >
            Visit Website 🔗
          </a>
        </div>
      )}
    </div>
  );
};
