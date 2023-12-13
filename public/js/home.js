const getElementById = (id) => document.getElementById(id).value || "";

const signUp = async () => {
  // console.log(inputId);
  const idValue = getElementById("id");
  const passwordValue = getElementById("password");

  await axios
    .post("http://localhost:3000/signup", {
      id: idValue,
      password: passwordValue,
    })
    .then((res) => {
      alert("회원가입 완료");
      window.location.href = "/";
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};

const signIn = async () => {
  // console.log(inputId);
  const idValue = getElementById("id");
  const passwordValue = getElementById("password");

  await axios
    .post("http://localhost:3000/signin", {
      id: idValue,
      password: passwordValue,
    })
    .then((res) => {
      window.location.href = `/rooms?id=${idValue}`; // 성공 시 메인 페이지로 이동
    })
    .catch((err) => {
      // window.location.href = "/rooms"; // 성공 시 메인 페이지로 이동
      alert(err.response.data.message);
    });
};
