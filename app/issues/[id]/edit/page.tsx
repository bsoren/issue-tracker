interface Props {
  params: Promise<{ id: string }>;
}
const EditIssuePage = async ({ params }: Props) => {
  const { id } = await params;
  return <div>EditIssuePage {id}</div>;
};

export default EditIssuePage;
