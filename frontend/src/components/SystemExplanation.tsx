const SystemExplanation = () => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mx-auto">Steps</h2>

      <div className="steps steps-horizontal w-full">
        <Step
          title="1. Correct translation"
          description="Use 'word x' instead of 'word y'"
          index={"🗣️"}
        />
        <Step
          title="2a. Apply correction"
          description="Makes the correction based on your input"
          index={"📝"}
        />
        <Step
          title="2b. Suggest improvements"
          description="How to avoid making the same mistake"
          index={"💡"}
        />
        <Step
          title="3. Add new entries to glossary"
          description="Accept or reject suggestions"
          index={"📖"}
        />
      </div>
    </div>
  );
};

const Step = ({
  title,
  description,
  index
}: {
  title: string;
  description: string;
  index: string;
}) => {
  return (
    <div className="step " data-content={index}>
      <div className="text-text-center">
        <div className="font-semibold pt-4">{title}</div>
        <div className="text-xs  pt-2">{description}</div>
      </div>
    </div>
  );
};

export default SystemExplanation;
