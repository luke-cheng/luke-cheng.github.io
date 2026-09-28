type GenerationNoticeProps = {
  title: string;
  description: string;
};

function GenerationNotice({ title, description }: GenerationNoticeProps) {
  return (
    <div className="generation-notice" role="status" aria-live="polite">
      <span className="generation-notice__dot" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default GenerationNotice;
