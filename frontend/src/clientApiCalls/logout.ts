export const logout = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_NEXT_API_URL}/logout`, {
    method: 'POST',
  });
};
