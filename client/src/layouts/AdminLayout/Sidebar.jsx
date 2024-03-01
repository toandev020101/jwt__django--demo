import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiPuzzle } from 'react-icons/hi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { BiBell, BiChevronDown, BiChevronRight, BiRadioCircle, BiUserPin } from 'react-icons/bi';
import { PiExam } from 'react-icons/pi';
import { LuCalendarClock, LuUserCog } from 'react-icons/lu';
import { GrCircleQuestion } from 'react-icons/gr';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';

const Sidebar = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const navItems = [
    {
      slug: '',
      name: 'Tổng quan',
      icon: <AiOutlineDashboard />,
    },
    {
      slug: 'thi-truc-tuyen',
      name: 'Quản lý thi trực tuyến',
      icon: <PiExam />,
      child: [
        {
          slug: '',
          name: 'Kỳ thi',
          icon: <LuCalendarClock />,
        },
        {
          slug: 'cau-hoi',
          name: 'Câu hỏi',
          icon: <GrCircleQuestion />,
        },
        {
          slug: 'bai-thi',
          name: 'Bài thi',
          icon: <IoDocumentTextOutline />,
        },
      ],
    },
    {
      slug: 'thong-bao',
      name: 'Quản lý thông báo',
      icon: <BiBell />,
    },
    {
      slug: 'tai-khoan',
      name: 'Quản lý người dùng',
      icon: <BiUserPin />,
      child: [
        {
          slug: '',
          name: 'Tài khoản',
          icon: <FiUser />,
        },
        {
          slug: 'vai-tro',
          name: 'Vai trò',
          icon: <LuUserCog />,
        },
      ],
    },
  ];

  return (
    <Box width={'320px'} bgcolor={theme.palette.common.white} color={theme.palette.grey[800]}
         boxShadow="5px 0 5px -5px rgba(0, 0, 0, 0.05)">
      {/* logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          color={theme.palette.primary.main}
          padding="20px 0"
        >
          <HiPuzzle fontSize={45} style={{ color: theme.palette.primary.main, marginTop: '-15px' }} />
          <Typography variant="h4">EngQuizz</Typography>
        </Box>
      </Link>
      {/* logo */}

      <List sx={{ margin: '20px 0' }} disablePadding>
        {navItems.map((nav, index) => (
          <Fragment key={`nav-item-${index}`}>
            {nav.child ? (
              <Fragment key={`nav-child-item-${index}`}>
                <ListItemButton
                  onClick={() => setOpenMenu(openMenu !== nav.slug ? (nav.slug) : null)}
                  sx={{
                    marginTop: '5px',
                    '&.MuiListItemButton-root': {
                      borderTopRightRadius: '30px',
                      borderBottomRightRadius: '30px',
                      marginRight: '10px',
                      backgroundColor: openMenu === nav.slug ? theme.palette.grey[100] : 'transparent',
                    },
                    '&.MuiListItemButton-root:hover': {
                      backgroundColor: theme.palette.grey[100],
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      fontSize: '24px',
                      marginRight: '15px',
                      marginTop: '-5px',
                      minWidth: 0,
                      color: theme.palette.grey[800],
                    }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText primary={nav.name} sx={{ '& .MuiListItemText-primary': { fontSize: '15px' } }} />

                  {openMenu === nav.slug || nav.slug === pathname.split('/')[2] ? (
                    <BiChevronDown fontSize="24px" style={{ color: theme.palette.grey[700] }} />
                  ) : (
                    <BiChevronRight fontSize="24px" style={{ color: theme.palette.grey[700] }} />
                  )}
                </ListItemButton>

                <Collapse
                  in={openMenu === nav.slug || nav.slug === pathname.split('/')[2]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {nav.child.map((navChild, index) => (
                      <Link to={`/quan-tri/${nav.slug}/${navChild.slug}`} key={`nav-item-child-${index}`}
                            style={{ textDecoration: 'none' }}>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            marginTop: '5px',
                            '&.MuiListItemButton-root': {
                              borderTopRightRadius: '30px',
                              borderBottomRightRadius: '30px',
                              marginRight: '10px',

                              backgroundImage:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? `linear-gradient(98deg, ${theme.palette.secondary.main},  ${theme.palette.primary.main} 94%)`
                                  : 'transparent',
                              color:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? theme.palette.common.white
                                  : theme.palette.grey[800],
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              fontSize: '24px',
                              marginRight: '15px',
                              marginTop: '-5px',
                              minWidth: 0,
                              color:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? theme.palette.common.white
                                  : theme.palette.grey[800],
                            }}
                          >
                            {navChild.icon ? navChild.icon : <BiRadioCircle />}
                          </ListItemIcon>
                          <ListItemText
                            primary={navChild.name}
                            sx={{ '& .MuiListItemText-primary': { fontSize: '15px' } }}
                          />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ) : (
              <Link to={`/quan-tri/${nav.slug}`} style={{ textDecoration: 'none' }}>
                <ListItemButton
                  onClick={() => setOpenMenu(null)}
                  sx={{
                    marginTop: '5px',
                    '&.MuiListItemButton-root': {
                      borderTopRightRadius: '30px',
                      borderBottomRightRadius: '30px',
                      marginRight: '10px',
                      backgroundImage:
                        (!pathname.split('/')[2] && !nav.slug) || nav.slug === pathname.split('/')[2]
                          ? `linear-gradient(98deg, ${theme.palette.secondary.main},  ${theme.palette.primary.main} 94%)`
                          : 'transparent',
                      color:
                        (!pathname.split('/')[2] && !nav.slug) || nav.slug === pathname.split('/')[2]
                          ? theme.palette.common.white
                          : theme.palette.grey[800],
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      fontSize: '24px',
                      marginRight: '15px',
                      marginTop: '-5px',
                      minWidth: 0,
                      color:
                        (!pathname.split('/')[2] && !nav.slug) || nav.slug === pathname.split('/')[2]
                          ? theme.palette.common.white
                          : theme.palette.grey[800],
                    }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText primary={nav.name} sx={{ '& .MuiTypography-root': { fontSize: '15px' } }} />
                </ListItemButton>
              </Link>
            )}
          </Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;