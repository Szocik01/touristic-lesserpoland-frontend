import IconBadge from "./IconBadge";

type PageHeaderProps = {
  icon: React.ReactNode;
  title: string;
  endElement?: React.ReactNode;
};

export default function PageHeader(props: PageHeaderProps) {
  const { icon, title, endElement } = props;

  return (
    <div className="page-header mb-5 mt-4">
      <h1>
        <IconBadge icon={icon} size="large" /> {title}
      </h1>
      {endElement && <div className="end-element">{endElement}</div>}
    </div>
  );
}
