import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function CardDisplay({
  photo,
  name,
  phone,
}) {
  console.log(photo);
  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>

      
        <CardContent sx={{ display: 'flex', flexDirection: 'row' }}>
          <Avatar
              alt="Aadhaar image"
              variant="square"
              src={'data:image/jpeg;base64,'+photo}
              sx={{ width: 75, height: 75 }}
            />
          <div>
          <Typography component="div" variant="subtitle1">
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            {phone}
          </Typography>
          </div>
        </CardContent>
      </Box>
    </Card>
  );
}
