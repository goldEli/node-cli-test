//@ts-ignore
import { Module } from "@nestjs/common";
import { AaaController } from "./aaa.controller";

@Module({ controllers: [AaaController] })
export class AaaModule {}
