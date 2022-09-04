import { Paper, InputBase } from "@mui/material";

export default function SearchBox(props) {
  const { placeholder, handleChange, handleSubmit } = props;
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </Paper>
  );
}
