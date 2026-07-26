import { Modal } from "@/presentation/components/ui/Modal";
import { VideoLecture, VideoLectureModel } from "@/domain/models/video-lecture.model";

interface VideoPreviewModalProps {
  open: boolean;
  lecture: VideoLecture | null;
  onClose: () => void;
}

// Students only ever see this embedded player — never the YouTube app
// or its recommendations, per spec. The iframe `sandbox` attribute
// deliberately omits `allow-top-navigation` and `allow-popups`, so
// clicking YouTube's own "Watch on YouTube" / logo links (which the
// embed always shows — YouTube's ToS doesn't allow removing them) is
// blocked by the browser instead of taking the student out of the app.
export function VideoPreviewModal({ open, lecture, onClose }: VideoPreviewModalProps) {
  if (!lecture) return null;
  const videoId = VideoLectureModel.extractVideoId(lecture.youtubeUnlistedUrl);

  return (
    <Modal open={open} onClose={onClose} title={lecture.title} description={`${lecture.subject} · ${lecture.course}`} widthClassName="max-w-2xl">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
        {videoId ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3`}
            title={lecture.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Invalid video link</div>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-500">{lecture.description}</p>
    </Modal>
  );
}
