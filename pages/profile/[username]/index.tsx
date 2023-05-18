export default function Profile({ username }: { username: string }) {
  return (
    <div>
      <h1>Perfil de {username}</h1>
    </div>
  );
}

export function getServerSideProps(context: any) {
  const { username } = context.query;
  return {
    props: {
      username
    }, // will be passed to the page component as props
  };
}


