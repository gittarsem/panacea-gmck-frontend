interface PageTitleProps {
  tag: string;
  title: string;
  sub?: string;
}

export default function PageTitle({
  tag,
  title,
  sub,
}: PageTitleProps) {
  return (
    <div
      style={{
        paddingTop: 40,
        paddingBottom: 55,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          marginBottom: 18,
        }}
      >
        {tag}
      </div>

      <h1
        className="display"
        style={{
          margin: 0,
          fontSize:
            "clamp(52px, 8vw, 110px)",
          lineHeight: 0.9,
        }}
      >
        {title}
      </h1>

      {sub && (
        <p
          style={{
            maxWidth: 650,
            marginTop: 24,
            fontSize: 17,
            lineHeight: 1.6,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}