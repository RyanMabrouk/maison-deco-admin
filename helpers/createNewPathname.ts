export default function createNewPathname({
  currentPathname,
  values,
}: {
  currentPathname: string;
  values: {
    name: string;
    value: string;
  }[];
}) {
  const params = new URLSearchParams();
  values.forEach(({ name, value }) => {
    params.set(name, value);
  });
  return currentPathname + "?" + params.toString();
}
