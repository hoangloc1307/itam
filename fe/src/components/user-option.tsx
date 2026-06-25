import { IconLogout2, IconUserCircle } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function UserOption() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={`https://v033.nok.com.vn/shared/images/12314092.jpg`}
            alt={'Trần Nguyễn Hoàng Lộc'}
            className='object-fill'
          />
          <AvatarFallback className='rounded-lg' style={{ backgroundColor: '#E57373' }}>
            US
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='min-w-56 rounded-lg'
        side={'bottom'}
        align='end'
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className='grid flex-1 text-left text-sm leading-tight text-popover-foreground'>
              <span className='truncate font-medium'>{'Trần Nguyễn Hoàng Lộc'}</span>
              <span className='truncate text-xs font-normal'>{'12314092'}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUserCircle />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            console.log('Logout');
          }}
        >
          <IconLogout2 />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
