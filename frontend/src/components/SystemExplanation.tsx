const SystemExplanation = () => {
  return (
    <div className="w-full">
      <div className="steps steps-vertical lg:steps-horizontal w-full">
        <Step
          title="Correct translation"
          description="Use 'pint' instead of 'beer'"
          index={"🗣️"}
        />
        <Step
          title="Apply correction"
          description="Makes the correction based on your input"
          index={"📝"}
        />
        <Step
          title="Suggest improvements"
          description="How to avoid making the same mistake"
          index={"💡"}
        />
        <Step
          title="Update glossary"
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
    <div className="step" data-content={index}>
      <div className="text-left">
        <div className="font-semibold pt-6 text-base lg:text-lg">{title}</div>
        <div className="text-sm pt-3 text-base-content/70 leading-relaxed max-w-xs">
          {description}
        </div>
      </div>
    </div>
  );
};

export default SystemExplanation;
