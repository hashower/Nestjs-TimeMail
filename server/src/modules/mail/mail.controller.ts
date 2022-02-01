import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {MailService} from "./mail.service";
import {CreateMailDto} from '../../shared/dto/create-mail-dto'
@Controller('mail')
export class MailController {

    constructor(private mailServer: MailService) {
    }

    @Get()
    getAlL() {
        return this.mailServer.getAll();
    }


    @Post()
    createMail(@Body() dto:CreateMailDto) {
        return this.mailServer.createMail(dto);
    }

    @Put()
    updateMailByMailId(@Body() dto:CreateMailDto) {
        return this.mailServer.updateMailByMailId(dto)
    }

    @Delete(':id')
    deleteMailByMailId(@Param('id') id:number) {
        return this.mailServer.deleteMailByMailId(id)
    }

    @Get(':id')
    getMailByMailId(@Param('id') id:number) {
        console.log(id)
        return this.mailServer.getMailByMailId(id);
    }

}