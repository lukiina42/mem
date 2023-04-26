import { Mem } from 'src/mem/mem.entity';
import { MemDto } from 'src/mem/mem.service';
import { S3Service } from 'src/s3/s3.service';
import { User } from 'src/user/user.entity';

export const mapMemsDbToDto = async (
  mems: Mem[],
  user: User,
  s3Service: S3Service,
): Promise<MemDto[]> => {
  const memsFe = [];

  for (let i = 0; i < mems.length; i++) {
    const mem: MemDto = mems[i];
    if (mem.imageKey) {
      const imageUrl = await s3Service.retrieveImage(mem.imageKey);
      mem.imageUrl = imageUrl;
    }

    const userAvatarKey = mem.owner.avatarImageKey;
    if (userAvatarKey) {
      mem.owner.avatarImageUrl = await s3Service.retrieveImage(userAvatarKey);
    }

    if (!user || !user.heartedMems) {
      mem.heartedByCurrentUser = false;
    } else {
      if (user.heartedMems.find((userMem) => mem.id === userMem.id)) {
        mem.heartedByCurrentUser = true;
      } else {
        mem.heartedByCurrentUser = false;
      }
    }

    const createdTime = new Date(mem.createdDate);
    const updatedTime = new Date(mem.updatedDate);

    const time =
      createdTime.getTime() == updatedTime.getTime()
        ? createdTime
        : updatedTime;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //todo use timeZone as a locale somehow
    const formatedTime = new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(time);

    mem.lastUpdateDate = formatedTime;

    memsFe.push(mem);
  }

  return memsFe;
};
